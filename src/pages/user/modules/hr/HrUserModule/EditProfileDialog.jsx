import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    Avatar,
    IconButton,
    Box,
    Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import useFormValidation from "@hooks/useForm";
import { employeeUpdateMyInfoSchema } from "@validations/hrSchema";
import UploadsService from "@services/util-service/uploads.service";
import toast from '@hooks/toast';
import DateField from '@components/DateField';

function EditProfileDialog({ open, onClose, employee, onSave }) {
    const avatarInputRef = useRef(null);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(employee?.avatar);
    const [isUploading, setIsUploading] = useState(false);

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
    } = useFormValidation(employeeUpdateMyInfoSchema, {
        name: employee?.name || '',
        dob: employee?.dob ? new Date(employee.dob) : null,
        avatar: employee?.avatar || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
    });

    const handleImageSelect = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarPreview(reader.result);
            setAvatarFile(file);
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        const [res, error] = await UploadsService.image(file);
        if (error) {
            toast.error(error.code);
            return null;
        }
        return res.data;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        startSubmitting();
        setIsUploading(true);

        try {
            let newAvatarUrl = data.avatar;

            if (avatarFile) {
                const uploadedAvatar = await uploadImage(avatarFile);
                if (uploadedAvatar) {
                    newAvatarUrl = uploadedAvatar;
                } else {
                    return;
                }
            }

            await onSave({
                ...data,
                avatar: newAvatarUrl,
            });

            setAvatarFile(null);
            onClose();
        } catch {
            toast.error("Đã xảy ra lỗi không mong muốn");
        } finally {
            setIsUploading(false);
            finishSubmitting();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Cập nhật thông tin</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {Object.keys(errors).length > 0 && (
                        <Alert severity="error">
                            Vui lòng kiểm tra lại thông tin
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={avatarPreview || data?.avatar}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: '2.5rem',
                                    bgcolor: (theme) => theme.palette.primary.main,
                                }}
                            >
                                {data.name?.charAt(0)}
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: -8,
                                    bottom: -8,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': {
                                        bgcolor: 'background.paper',
                                    },
                                }}
                                component="label"
                                disabled={isSubmitting || isUploading}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <input
                                    hidden
                                    ref={avatarInputRef}
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleImageSelect(e.target.files[0])}
                                />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                    </Box>

                    <TextField
                        label="Họ và tên"
                        fullWidth
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={isSubmitting || isUploading}
                    />
                    <DateField
                        label="Ngày sinh"
                        value={data.dob}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        error={!!errors.dob}
                        helperText={errors.dob}
                        sx={{ mt: 2 }}
                        disabled={isSubmitting || isUploading}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={data.email}
                        type="email"
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isSubmitting || isUploading}
                    />
                    <TextField
                        label="Số điện thoại"
                        fullWidth
                        value={data.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        disabled={isSubmitting || isUploading}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={isSubmitting || isUploading}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting || isUploading}
                >
                    {isSubmitting || isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditProfileDialog;