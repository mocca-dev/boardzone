import eventsData from './events-mock.json';

export const eventObservable = {
  subscribe: (callback: any) => {
    eventsData.forEach((event) => {
      setTimeout(() => {
        callback(event);
      }, 1500);
    });
  },
};

// export const observer = {
//   next: (x: any) => {
//     console.log(x);
//   },
//   error: (err: any) => {
//     console.log(err);
//   },
//   complete: () => {
//     console.log('done');
//   },
// };
