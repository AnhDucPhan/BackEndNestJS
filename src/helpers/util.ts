const bcrypt = require('bcrypt');
const saltRounds = 10;// số lần lặp để tăng mức độ bảo mật của password

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
        
    } catch (err) {
        console.log(err)
    }

}

export const comparePasswordHelper = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword,hashPassword);
        
    } catch (err) {
        console.log(err)
    }

}