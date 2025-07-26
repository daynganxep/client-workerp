import { ContentCopy } from '@mui/icons-material';
import toast from '@hooks/toast';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


const UserMenu = ({ user }) => {
    const handleCopyId = () => {
        navigator.clipboard.writeText(user?.id);
        toast.success('Đã sao chép ID');
    };

    return (
        <Tippy
            content={<Box
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                        src={user?.avatar}
                        sx={{
                            width: 56,
                            height: 56,
                            border: (theme) => `2px solid ${theme.palette.primary.main}`,
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {user?.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email}
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            User ID
                        </Typography>
                        <Typography variant="body2">
                            {user?.id}
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={handleCopyId}
                        sx={{
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'background.paper' },
                        }}
                    >
                        <ContentCopy fontSize="small" />
                    </IconButton>
                </Box>
            </Box>}
            interactive={true}
            placement="bottom-end"
            trigger="click"
            arrow={false}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                <Avatar
                    src={user?.avatar}
                    srcSet={user?.avatar}
                    sx={{
                        width: 32,
                        height: 32,
                        border: (theme) => `2px solid ${theme.palette.primary.main}`,
                    }}
                />
                <Typography variant="body1">
                    {user?.fullName || 'User'}
                </Typography>
            </Box>
        </Tippy>

    );
};

export default UserMenu;