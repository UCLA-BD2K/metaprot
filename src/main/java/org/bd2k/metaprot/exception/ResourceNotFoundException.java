package org.bd2k.metaprot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Represents a 404 exception.
 *
 * Created by allengong on 8/12/16.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private String reason;

    public ResourceNotFoundException(){
        super("The requested resource was not found.");
    }
    public ResourceNotFoundException(String reason) {
        super(reason);
    }

}
