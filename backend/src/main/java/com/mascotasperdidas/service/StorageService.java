package com.mascotasperdidas.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${app.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
    }

    public String store(MultipartFile file) {
        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);
        String filename = UUID.randomUUID() + ext;

        try {
            if (file.isEmpty()) throw new RuntimeException("No se puede guardar un fichero vacío");
            Path dest = Paths.get(uploadDir).resolve(filename).normalize().toAbsolutePath();
            if (!dest.startsWith(Paths.get(uploadDir).toAbsolutePath())) {
                throw new RuntimeException("No se puede guardar el fichero fuera del directorio de uploads");
            }
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el fichero: " + e.getMessage(), e);
        }
    }

    public Path load(String filename) {
        return Paths.get(uploadDir).resolve(filename).normalize();
    }

    public void delete(String filename) {
        try {
            Path file = load(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar el fichero: " + filename, e);
        }
    }
}
