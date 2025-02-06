package com.rf.portfolioM.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rf.portfolioM.exception.CloudinaryException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz.");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Dosyanın içerik türü belirlenemedi.");
        }

        Map<String, Object> options = new HashMap<>();

        if (contentType.startsWith("image/")) {
            options.put("quality", "auto:low"); // Kaliteyi düşürerek sıkıştır
            options.put("width", 800); // Genişliği ayarla
            options.put("crop", "scale"); // Oranı koruyarak yeniden boyutlandır
            options.put("fetch_format", "auto"); // Cloudinary uygun formatı belirlesin
        } else if (contentType.equals("application/pdf")) {
            options.put("resource_type", "raw"); // PDF gibi belgeleri ham veri olarak işle
        } else {
            throw new CloudinaryException(contentType);
        }

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);


        return (String) uploadResult.get("secure_url"); // Güvenli HTTPS bağlantısını al
    }

    public String deleteFile(String fileUrl) {
        try {
            String publicId = extractPublicId(fileUrl);

            if (publicId == null || publicId.isEmpty()) {
                return "Error: Public ID could not be extracted from the URL.";
            }


            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            return (String) result.get("result");
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    // 🔥 URL'den Public ID'yi Çıkaran Yardımcı Metod
    private String extractPublicId(String fileUrl) {
        try {
            // Cloudinary URL yapısı: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/{public_id}.jpg
            String regex = ".*/upload/(v[0-9]+/)?([^/.]+).*";
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(fileUrl);

            if (matcher.matches()) {
                return matcher.group(2); // Public ID'yi döndür
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


}
