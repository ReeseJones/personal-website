export interface Page {
    name: string;
    path: string;
    children: Page[];
}


export const pages: Page = {
    name: "Home",
    path: "/",
    children: [
        {
            name: "Articles",
            path: "/articles/",
            children: [
            ]
        },
        {
            name: "About Me",
            path: "/about-me/",
            children: [

            ]
        },
    ]
}

export const navbarPages = [
    pages,
    ...pages.children
]