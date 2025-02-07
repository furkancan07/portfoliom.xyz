package com.rf.portfolioM.dto;

import com.rf.portfolioM.model.enums.ContactAddresses;

import java.util.Map;

import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddContactAddressesRequest {
    private Map<ContactAddresses, String> contactAddresses;
}
