package com.rf.portfolioM.utils;

public class ApiPaths {
    public static final String VERSION = "api/v1/";
    public static final String AUTH = VERSION + "auth/";
    public static final String USER = VERSION + "user/";
    public static final String COMMENT = VERSION + "comment/";
    public static final String PROJECT = VERSION + "project/";
    public static final String CREATE = "create";
    public static final String DELETE = "delete/{id}";
    public static final String UPDATE = "update/{id}";
    public static final String UPDATE_PROFILE_PHOTO = "profile-photo/" + UPDATE;
    public static final String DELETE_PROFILE_PHOTO = "profile-photo/" + "delete";
    public static final String UPLOAD_CV = "upload-cv/{userId}";
    public static final String ADD_SKILL = "add-skill";
    public static final String ADD_CONTACT = "add_contact_addresses/{id}";
    public static final String USER_BY_USERNAME = "username/{username}";
    public static final String ID = "{id}";
    public static final String PROJECT_BY_USER = "list/project/{userId}";
    public static final String LIST = "list";
    public static final String GET_PROJECT_BY_USER_AND_TAG=PROJECT_BY_USER+"/{tag}";
    public static final String ADD_COMMENT=CREATE+"/{projectId}";

    public static final String GET_COMMENTS_BY_PROJECT = "project/{id}";
    public static final String LOGIN = "login";
}
