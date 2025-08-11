import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import "./.scss";

function ModuleTabLayout({ tabs }) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box className="module-tab-layout">
            {tabs.length > 1 && (
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="module-tabs"
                >
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            )}
            <Box className="tab-content">
                {tabs[selectedTab]?.content || <div>No content available</div>}
            </Box>
        </Box>
    );
}

export default ModuleTabLayout;
