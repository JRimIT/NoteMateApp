// enum FeedSort {
//     Latest = 'latest',
//     Top = 'top'
//   }


type RootStackParamList = {
    index: undefined; // Login page
    detail: { id: string }; // Detail page with an ID parameter
    create: undefined; // Create page
    profile: undefined; // Profile page
    settings: undefined; // Settings page
    feed: { sort?: 'latest' | 'top' }; // Feed page with optional sort parameter
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}