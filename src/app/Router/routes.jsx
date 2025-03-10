import adminRoutes from "./routes/route.admin";
import userRoutes from "./routes/route.user";

let allRoutes = [...adminRoutes, ...userRoutes];

allRoutes = allRoutes.map((route) => {
    const { Layout, Page, title } = route;
    return {
        path: route.path,
        type: route.type,
        title: title,
        element: (
            <Layout>
                <Page></Page>
            </Layout>
        ),
    };
});

export default allRoutes;
