import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Stack,
    Alert,
    Switch,
    FormControlLabel,
    IconButton,
    Box,
    Avatar,
    CardMedia,
    alpha,
} from "@mui/material";
import toast from "@hooks/toast";
import CompanyService from "@services/compay-module-service/company.service";
import { updateCompanyInforSchema } from "@validations/companySchema";
import { companyActions } from "@redux/slices/company.slice";
import { Edit, PhotoCamera } from "@mui/icons-material";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import useFormValidation from "@hooks/useForm";
import UploadsService from "@services/util-service/uploads.service";

function CompanyInfoTab() {
    const [errorMessage, setErrorMessage] = useState("");
    const getMessage = useMessageByApiCode();
    const dispatch = useDispatch();
    const { name, domain, avatar, active, coverImage } = useSelector(
        (state) => state.company,
    );

    // Refs for file inputs
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // States for image handling
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(avatar);
    const [coverPreview, setCoverPreview] = useState(coverImage);
    const [isUploading, setIsUploading] = useState(false);

    // Form validation
    const {
        data,
        errors,
        isSubmitting,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(updateCompanyInforSchema, {
        name: name || "",
        domain: domain || "",
        avatar: avatar || "",
        coverImage: coverImage || "",
        active: active !== undefined ? active : true,
    });

    // Sync form data with Redux state
    useEffect(() => {
        handleChange("name", name || "");
        handleChange("domain", domain || "");
        handleChange("avatar", avatar || "");
        handleChange("coverImage", coverImage || "");
        handleChange("active", active !== undefined ? active : true);
    }, [name, domain, avatar, coverImage, active, handleChange]);

    // Handle image selection for preview
    const handleImageSelect = (file, type) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'avatar') {
                setAvatarPreview(reader.result);
                setAvatarFile(file);
            } else {
                setCoverPreview(reader.result);
                setCoverFile(file);
            }
        };
        reader.readAsDataURL(file);
    };

    // Helper function to upload single image
    const uploadImage = async (file) => {
        if (!file) return null;
        const [res, error] = await UploadsService.image(file);
        if (error) {
            toast.error("Không thể tải ảnh lên");
            return null;
        }
        return res.data;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        startSubmitting();
        setIsUploading(true);

        try {
            // Upload new images if selected
            let newAvatarUrl = data.avatar;
            let newCoverUrl = data.coverImage;

            if (avatarFile) {
                const uploadedAvatar = await uploadImage(avatarFile);
                if (uploadedAvatar) {
                    newAvatarUrl = uploadedAvatar;
                } else {
                    return;
                }
            }

            if (coverFile) {
                const uploadedCover = await uploadImage(coverFile);
                if (uploadedCover) {
                    newCoverUrl = uploadedCover;
                } else {
                    return;
                }
            }

            // Update company info
            const [res, error] = await CompanyService.updateCompanyInfo({
                ...data,
                avatar: newAvatarUrl,
                coverImage: newCoverUrl,
            });

            console.log(res)

            if (error) {
                setErrorMessage(getMessage(error.code));
                toast.error(error.code);
                return;
            }

            toast.success(res.code);
            dispatch(companyActions.setCompanyInfo(res.data));

            // Reset file states
            setAvatarFile(null);
            setCoverFile(null);

        } catch (err) {
            toast.error("Đã xảy ra lỗi không mong muốn");
        } finally {
            setIsUploading(false);
            finishSubmitting();
        }
    };

    // Add this helper function inside the component
    const getCoverBackground = (theme, url) => {
        if (url) {
            return {
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        }
        return {
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        };
    };


    return (
        <Stack spacing={4}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box sx={{ position: 'relative' }}>
                {/* Cover Image */}
                <CardMedia
                    component="div"
                    sx={(theme) => ({
                        height: 300,
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        ...getCoverBackground(theme, coverPreview),
                        borderRadius: "8px"
                    })}
                />
                <input
                    type="file"
                    ref={coverInputRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files[0], 'cover')}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: 'background.paper',
                        '&:hover': {
                            bgcolor: 'background.paper',
                        },
                    }}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isSubmitting || isUploading}
                >
                    <Edit />
                </IconButton>

                {/* Avatar - Updated positioning */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        transform: 'translate(-50%, 50%)',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={avatarPreview}
                            sx={(theme) => ({
                                width: 120,
                                height: 120,
                                border: 4,
                                borderColor: 'background.paper',
                                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                            })}
                        />
                        <input
                            type="file"
                            ref={avatarInputRef}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleImageSelect(e.target.files[0], 'avatar')}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: -8,
                                bottom: -8,
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    bgcolor: 'background.paper',
                                },
                            }}
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={isSubmitting || isUploading}
                        >
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ marginTop: "60px" }}>
                    <TextField
                        fullWidth
                        label="Tên công ty"
                        name="name"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        fullWidth
                        label="Domain"
                        name="domain"
                        value={data.domain}
                        onChange={(e) => handleChange("domain", e.target.value)}
                        error={!!errors.domain}
                        helperText={errors.domain}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.active}
                                onChange={(e) => handleChange("active", e.target.checked)}
                            />
                        }
                        label="Trạng thái hoạt động"
                    />

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || isUploading}
                    >
                        {isSubmitting || isUploading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}

export default CompanyInfoTab;