package com.makemytrip.makemytrip.config;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "usiddik331@gmail.com";
        if (userRepository.findByEmail(adminEmail) == null) {
            Users admin = new Users();
            admin.setFirstName("Abubakar");
            admin.setLastName("Siddik");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("siddik@123"));
            admin.setRole("ADMIN");
            admin.setPhoneNumber("+91 8309637682");
            userRepository.save(admin);
            System.out.println(">>> Admin account created: " + adminEmail);
        } else {
            System.out.println(">>> Admin account already exists: " + adminEmail);
        }
    }
}
