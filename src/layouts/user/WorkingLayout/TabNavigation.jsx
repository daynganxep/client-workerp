import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const TabNavigation = ({ tabs, basePath, sx }) => {
    const navigate = useNavigate();
    const params = useParams();
    const currentTab = params.tab || tabs[0]?.value;
    const [value, setValue] = useState(currentTab);

    useEffect(() => {
        if (params.tab && tabs.some((tab) => tab.value === params.tab)) {
            setValue(params.tab);
        } else {
            navigate(`${basePath}/${tabs[0].value}`, { replace: true });
            setValue(tabs[0].value);
        }
    }, [params.tab, tabs, basePath, navigate]);

    const handleChange = (_, newValue) => {
        setValue(newValue);
        navigate(`${basePath}/${newValue}`);
    };

    const selectedTab = tabs.find((tab) => tab.value === value);

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="navigation tabs"
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        minWidth: 120,
                        fontWeight: 'medium',
                    },
                    '& .Mui-selected': {
                        fontWeight: 'bold',
                    }
                }}
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        aria-label={tab.label}
                    />
                ))}
            </Tabs>
            <Box sx={{ py: 3 }}>
                {selectedTab ? (
                    selectedTab.element
                ) : (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: 'center' }}
                    >
                        Tab không hợp lệ
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

TabNavigation.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            element: PropTypes.element.isRequired
        })
    ).isRequired,
    basePath: PropTypes.string.isRequired,
    sx: PropTypes.object
};

export default TabNavigation;