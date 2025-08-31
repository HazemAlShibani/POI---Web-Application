importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCxbEBFnts_leSaBn6sLmyOoMS9_Woh-ws',
  projectId: 'oi-project-bf260',
  messagingSenderId: '592638310141',
  appId: '1:592638310141:web:645ee4f5eb4d8e5b127094',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});