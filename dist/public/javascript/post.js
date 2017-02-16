$(function() {
    var chapterLength = $('.chapter-btn').data('chaptermax');
    var chapter, post, tryLoadCount, preChapterPostLength, currentChapterPostLength;

    function getQueryStringByName(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }

    function load(cha, po) {
        $('#content').empty().load('book/' + cha + '/' + po + '.html', function(response, status, xhr) {
            if (status == 'error') {
                $('#content').html('出现错误啦，请重试！')
            } else {
                window.scrollTo(0, 0);
            }
        });

    }

    function addHistory(cha, po) {
        history.pushState({ "chapter": cha, post: po }, '', '/post.html?chapter=' + cha + '&post=' + po);
        reset();
        load(chapter, post);
    };

    function reset() {
        chapter = getQueryStringByName('chapter');
        post = getQueryStringByName('post');
        $.get('/api/getpostinfo', {
                chapter: chapter
            },
            function(data, textStatus, jqXHR) {
                data = JSON.parse(data);
                currentChapterPostLength = data.currentChapterPostLength;
                preChapterPostLength = data.preChapterPostLength;
            },
            'JSON'
        );
    }

    function bind() {
        $('.pre-chapter-btn').on('click', function() {
            var preP, preC;
            if (post == 0) {
                if (chapter == 0) {
                    return;
                } else {
                    preC = +chapter - 1;
                    preP = +preChapterPostLength - 1;
                }
            } else {
                preC = chapter;
                preP = +post - 1;
            }
            addHistory(preC, preP);
        })

        $('.next-chapter-btn').on('click', function() {
            var nextP, nextC;
            console.log(currentChapterPostLength);
            if (post >= +currentChapterPostLength - 1) {
                if (chapter >= chapterLength - 1) {
                    return;
                } else {
                    nextC = +chapter + 1;
                    nextP = 0;
                }
            } else {
                nextC = chapter;
                nextP = +post + 1;
            }
            addHistory(nextC, nextP);
        })
    }

    reset();
    load(chapter, post);
    bind();
})
