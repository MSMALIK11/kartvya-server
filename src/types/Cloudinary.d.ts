declare module 'cloudinary' {
    interface CloudinaryConfig {
        cloud_name: string;
        api_key: string;
        api_secret: string;
        secure?: boolean;
        // Add other properties as needed
    }

    interface Cloudinary {
        config(config: CloudinaryConfig): void;
        // Add other methods as needed
    }

    const cloudinary: Cloudinary;
    export default cloudinary;
}
