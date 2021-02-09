(function($) {
    $(function() {
        $.widget("zpd.paging", {
            options: {
                limit: 5,
                rowDisplayStyle: 'block',
                activePage: 0,
                rows: []
            },
            _create: function() {
                const rows = $("tbody", this.element).children();
                this.options.rows = rows;
                this.options.rowDisplayStyle = rows.css('display');
                const nav = this._getNavBar();
                this.element.after(nav);
                this.showPage(0);
            },
            _getNavBar: function() {
                const rows = this.options.rows;
                const nav = $('<div>', {class: 'paging-nav'});
                for (let i = 0; i < Math.ceil(rows.length / this.options.limit); i++) {
                    this._on($('<a>', {
                            href: '#',
                            text: (i + 1),
                            "data-page": (i)
                        }).appendTo(nav),
                        {click: "pageClickHandler"});
                }
                //create previous link
                this._on($('<a>', {
                        href: '#',
                        text: '<<',
                        "data-direction": -1
                    }).prependTo(nav),
                    {click: "pageStepHandler"});
                //create next link
                this._on($('<a>', {
                        href: '#',
                        text: '>>',
                        "data-direction": +1
                    }).appendTo(nav),
                    {click: "pageStepHandler"});
                return nav;
            },
            showPage: function(pageNum) {
                const num = pageNum * 1; //it has to be numeric
                this.options.activePage = num;
                const rows = this.options.rows;
                const limit = this.options.limit;
                for (let i = 0; i < rows.length; i++) {
                    if (i >= limit * num && i < limit * (num + 1)) {
                        $(rows[i]).css('display', this.options.rowDisplayStyle);
                    } else {
                        $(rows[i]).css('display', 'none');
                    }
                }
            },
            pageClickHandler: function(event) {
                event.preventDefault();
                $(event.target).siblings().attr('class', "");
                $(event.target).attr('class', "selected-page");
                const pageNum = $(event.target).attr('data-page');
                this.showPage(pageNum);
            },
            pageStepHandler: function(event) {
                event.preventDefault();
                //get the direction and ensure it's numeric
                const dir = $(event.target).attr('data-direction') * 1;
                const pageNum = this.options.activePage + dir;
                //if we're in limit, trigger the requested pages link
                if (pageNum >= 0 && pageNum < this.options.rows.length) {
                    $("a[data-page=" + pageNum + "]", $(event.target).parent()).click();
                }
            }
        });
    });
})(jQuery);
