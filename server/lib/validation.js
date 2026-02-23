const validateString = (input) => {
    if(!input || input === ""){
        return false;
    }
    return /^[^<>%;"']+$/.test(input);
};

const validateStrictString = (input) => {
    if(!input || input === ""){
        return false;
    }
    return /^[a-zA-Z]+$/.test(input);
};

const validatePrice = (input) => {
    if(!input || input < 0 || input > 999999.99 || isNaN(input)){
        return false;
    }
    return /^[0-9]+(\.[0-9]{1,2})?$/.test(input);
}

const validateDate = (input) => {
    if(!input || input === ""){
        return false;
    }
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input);
}

const validateEmail = (input) => {
    if(!input || input === ""){
        return false;
    }
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input);
}

const validatePassword = (input) => {
    if(!input || input === ""){
        return false;
    }
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input);
}

const validateFile = (file) => {
    if(!file)
    {
        console.log("No file uploaded");
        return false;
    }
    else if(file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg")
    {
        console.log("Invalid file type");
        return false;
    }
    console.log("File uploaded successfully");
    return true;
}

module.exports = {
    validateString,
    validatePrice,
    validateDate,
    validateEmail,
    validatePassword,
    validateFile
};