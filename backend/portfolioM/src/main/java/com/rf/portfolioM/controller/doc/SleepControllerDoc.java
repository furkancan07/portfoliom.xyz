package com.rf.portfolioM.controller.doc;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Health API", description = "Basit sağlık kontrolü ve uptime endpoinleri")
public interface SleepControllerDoc {

    @Operation(summary = "Uyanıklık testi", description = "Sunucunun uyumasını engellemek için basit kontrol",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Uygulama ayakta",
                            content = @io.swagger.v3.oas.annotations.media.Content(
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(example = "Serverin uyumasını engelle")
                            ))
            })
    ResponseEntity<?> ok();
}


