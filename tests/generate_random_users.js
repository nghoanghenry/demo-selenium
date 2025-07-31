import { faker } from '@faker-js/faker';
import fs from 'fs';

const users = [];

for (let i = 0; i < 500; i++) {
  // Tạo ngày sinh từ 18-65 tuổi
  const dob = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  
  // Format ngày sinh theo YYYY-MM-DD (như website yêu cầu)
  const year = dob.getFullYear();
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const day = String(dob.getDate()).padStart(2, '0');
  const formattedDob = `${year}-${month}-${day}`;

  // Tạo số điện thoại chỉ có số (loại bỏ ký tự đặc biệt)
  const phoneNumber = faker.string.numeric(10); // 10 chữ số

  // Tạo password với ít nhất 1 ký tự đặc biệt
  const basePassword = faker.internet.password({
    length: 8,
    memorable: false,
    pattern: /[A-Za-z0-9]/,
  });
  const specialChars = '@#$%&*';
  const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
  const finalPassword = basePassword + randomSpecialChar + faker.string.numeric(1);

  const user = {
    firstName: faker.person.firstName(),                    
    lastName: faker.person.lastName(),                      
    dob: formattedDob,                                      // Format YYYY-MM-DD
    street: faker.location.streetAddress(),                 
    postalCode: faker.string.numeric(6),                    // 6 chữ số
    city: faker.location.city(),                            
    state: faker.location.state(),                          
    country: faker.helpers.arrayElement(['VN', 'US', 'GB', 'DE', 'FR', 'AU', 'CA']), // Các mã quốc gia phổ biến
    phone: phoneNumber,                                     // Chỉ có số
    email: faker.internet.email().toLowerCase(),            
    password: finalPassword                                 // Password có ít nhất 1 ký tự đặc biệt
  };

  users.push(user);
}

// ✅ Ghi ra file JSON
fs.writeFileSync('./data/users_random_500.json', JSON.stringify(users, null, 2), 'utf-8');
console.log("✅ Đã tạo xong file data/users_random_500.json với 500 user đã được sửa format");
console.log("📋 Format mới:");
console.log("  - Date of Birth: YYYY-MM-DD (ví dụ: 1996-04-26)");
console.log("  - Phone: Chỉ có số (ví dụ: 1234567890)");
console.log("  - Password: Có chữ, số và ký tự đặc biệt (@#$%&*)");
console.log("  - Country: Mã quốc gia phổ biến (VN, US, GB, etc.)");
