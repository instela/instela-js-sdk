module.exports = {
    "version": "3.0",
    "metadata": {
        "endpointPrefix": "oauth",
        "serviceFullName": "Instela OAuth Service"
    },
    "operations": {
        "GetAccessToken": {
            "name": "GetAccessToken",
            "http": {
                "method": "POST",
                "requestUri": "/login"
            },
            "parameters": [
                {
                    "name": "username",
                    "location": "body"
                },
                {
                    "name": "password",
                    "location": "body"
                }
            ],
            "map": "Token",
            "errors": {
                "400": {
                    "shape": "BadRequestException",
                    "exception": true
                },
                "401": {
                    "shape": "UnauthorizedException",
                    "exception": true
                },
                "403": {
                    "shape": "UnauthorizedException",
                    "exception": true
                },
                "404": {
                    "shape": "NotFoundException",
                    "exception": true
                },
                "429": {
                    "shape": "TooManyRequestsException",
                    "exception": true
                }
            }
        }
    }
};