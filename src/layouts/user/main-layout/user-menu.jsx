import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from '@hooks/toast';
import { ContentCopy } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';


const UserMenu = ({ user }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user?.id);
        toast.success("layout.main.copy-id", false);
    };

    return (
        <Tippy
            visible={visible}
            onClickOutside={() => setVisible(false)}
            interactive
            placement="bottom-end"
            render={(attrs) =>
                <Box {...attrs} sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                    boxShadow: theme.shadows[3],
                    p: 2,
                    minWidth: 260,
                }}
                >
                    <Stack spacing={2} sx={{ minWidth: 260 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={user?.avatar} />
                            <Box>
                                <Typography variant="subtitle1" noWrap>
                                    {user?.fullName}
                                </Typography>
                                <Typography variant="subtitle1" noWrap>
                                    {user?.email}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'action.hover', borderRadius: 1, px: 2, py: 1 }}>
                            <Box flex={1}>
                                <Typography variant="caption">
                                    User ID
                                </Typography>
                                <Typography variant="body2" noWrap>
                                    {user?.id}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={handleCopyId}
                            >
                                <ContentCopy fontSize="small" color='primary' />
                            </IconButton>
                        </Stack>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/auth/logout"
                        >
                            {t("layout.main.logout-button")}
                        </Button>
                    </Stack>
                </Box>
            }
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setVisible(true)}>
                <Avatar src={user?.avatar} srcSet={user?.avatar} />
                <Typography variant="body1" sx={{ display: { xs: "none", md: "flex" } }}>
                    {user?.fullName || user?.email}
                </Typography>
            </Box>
        </Tippy>
    );
};

export default UserMenu;