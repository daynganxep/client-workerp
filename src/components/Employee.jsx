import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Box, Typography, Stack, Divider, useTheme } from "@mui/material";
import { formatDateForUI } from "@tools/date.tool";
import Tippy from '@tippyjs/react/headless';

function EmployeeTooltip({ employee, size = 1 }) {
    return (
        <Stack
            sx={{
                padding: `${8 * size}px ${12 * size}px`,
                minWidth: 180 * size,
                maxWidth: 280 * size,
            }}
            spacing={1 * size}
        >
            <Stack direction="row" spacing={1.5 * size} alignItems="center">
                <Avatar
                    src={employee.avatar}
                    sx={{
                        width: 40 * size,
                        height: 40 * size,
                        fontSize: 12 * size
                    }}
                >
                    {employee?.name?.charAt(0)}
                </Avatar>
                <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontSize: `${0.875 * size}rem`,
                            fontWeight: 600,
                            lineHeight: 1.2
                        }}
                    >
                        {employee.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: `${0.75 * size}rem` }}
                    >
                        {employee.position?.name}
                    </Typography>
                </Box>
            </Stack>

            <Divider />

            <Stack spacing={0.5 * size}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 * size }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            minWidth: 60 * size,
                            fontSize: `${0.7 * size}rem`,
                            fontWeight: 500
                        }}
                    >
                        Phòng ban:
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: `${0.75 * size}rem`,
                            color: 'text.primary'
                        }}
                    >
                        {employee.department?.name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 * size }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            minWidth: 60 * size,
                            fontSize: `${0.7 * size}rem`,
                            fontWeight: 500
                        }}
                    >
                        Ngày sinh:
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: `${0.75 * size}rem`,
                            color: 'text.primary'
                        }}
                    >
                        {formatDateForUI(employee.dob)}
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    );
}

function Employee({ employeeId, size = 1, tollTipSize = 1, showName = false, ...props }) {
    const theme = useTheme();
    const employee = useSelector(state => state?.company?.employeesMap[employeeId]);
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef(null);

    if (!employee) return null;

    const clearHideTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const delayHide = () => {
        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, 200); // delay tránh bị tắt tooltip khi chuột di chuyển giữa trigger và tooltip
    };

    return (
        <Tippy
            visible={visible}
            interactive
            placement="right"
            appendTo={() => document.body}
            render={(attrs) => (
                <Box
                    {...attrs}
                    onMouseEnter={clearHideTimeout}
                    onMouseLeave={delayHide}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                        p: 1,
                        maxWidth: 300,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <EmployeeTooltip employee={employee} size={tollTipSize} />
                </Box>
            )}
            delay={[1000, 0]}
        >
            <Box
                onMouseEnter={() => {
                    clearHideTimeout();
                    setVisible(true);
                }}
                onMouseLeave={delayHide}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                {...props}
            >
                <Avatar
                    src={employee.avatar}
                    alt={employee.name}
                    sx={{
                        width: 40 * size,
                        height: 40 * size,
                        fontSize: 16 * size,
                        mr: 1,
                        '&:hover': {
                            boxShadow: theme.shadows[4],
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                >
                    {employee?.name?.charAt(0)}
                </Avatar>
                {showName && (
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {employee.name}
                    </Typography>
                )}
            </Box>
        </Tippy>
    );
}

export default Employee;
