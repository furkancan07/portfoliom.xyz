package com.rf.portfolioM.config;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@Service
public class PreventSleepService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String API_URL = "https://portfoliom-is7q.onrender.com/isSleep";

    @Scheduled(fixedRate = 840000) // 14 dakika = 14 * 60 * 1000
    public void keepAlive() {
        try {
            String response = restTemplate.getForObject(API_URL, String.class);
            System.out.println("PreventSleepService Çalıştı"+response);
        } catch (Exception e) {
            System.err.println("PreventSleepService Hata: " + e.getMessage());
        }
    }
}