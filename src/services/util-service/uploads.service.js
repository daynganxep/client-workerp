import axios, { service } from "@tools/axios.tool";

const UploadsService = {
    async image(imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile, "image.jpg");
        return service(
            axios.post("/util/uploads/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        );
    },
    async images(imageFiles) {
        const formData = new FormData();
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });
        }
        return service(
            axios.post("/util/uploads/images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        );
    },
    async video(videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        return service(
            axios.post("/util/uploads/video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        );
    },
    async delete(fileUrl) {
        return service(axios.delete("/util/uploads", { file_url: fileUrl }));
    },
    async blobUrlToFile(blobUrl, fileName) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], fileName, { type: blob.type });
    },
};

export default UploadsService;
