$('#countdown').countdown({
    date: '10/30/2020 17:00:00',
    offset: +2,
    day: 'Day',
    days: 'Days',
    hideOnComplete: true
}, function (container) {
    alert('Done!');
    console.log(container);
    console.log('win height', $(window).height());
    console.log('win width', $(window).width());

// Size of HTML document (same as pageHeight/pageWidth in screenshot).
    console.log('doc height', $(document).height());
    console.log('doc width', $(document).width());
});
