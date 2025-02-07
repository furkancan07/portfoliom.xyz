package com.rf.portfolioM.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rf.portfolioM.exception.CloudinaryException;
import com.rf.portfolioM.exception.MaxFilesException;
import com.rf.portfolioM.exception.OnlyImageException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;
    private static final int MAX_FILES=5;

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
            options.put("quality", "auto:low");
            options.put("width", 800);
            options.put("crop", "scale");
            options.put("fetch_format", "auto");
        } else if (contentType.equals("application/pdf")) {
            options.put("resource_type", "image");
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

    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        if (files.size() > MAX_FILES) {
            throw new MaxFilesException("En fazla " + MAX_FILES + " dosya yükleyebilirsiniz.");
        }

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!isImage(file)) {
                throw new OnlyImageException();
            }
            String fileUrl = uploadFile(file);
            uploadedUrls.add(fileUrl);
        }

        return uploadedUrls;
    }


    private String extractPublicId(String fileUrl) {
        try {
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

    private boolean isImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }


}
