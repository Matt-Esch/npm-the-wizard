var document = require("document")

var easing = require("./lib/easing.js")
var scrollTo = require("./lib/scroll-to")

module.exports = Scroller

function Scroller(elems) {
    elems.scroll.onscroll = function(event) {
        var sections = [elems.demo, elems.docs, elems.test];
        var currentSelection, i;
        for (i = 0; i < sections.length; i++) {
            var section = sections[i];
            if (elems.scroll.scrollTop > section.offsetTop - 21) {
                currentSelection = section;
            }
        }
        if (currentSelection.id) {
            var buttons = document.querySelectorAll("#menu button");
            for (i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("active");
            }
            document.querySelector("#menu button." + currentSelection.id)
                .classList.add("active");
        }
    }

    elems.demo.addEventListener("click", scrollToDemo)
    elems.docs.addEventListener("click", scrollToDocs)
    elems.test.addEventListener("click", scrollToTest)

    function scrollToDemo() {
        scrollTo(elems.demo.offsetTop-20, elems.scroll, 300, easing.easeInQuad);
    }

    function scrollToDocs() {
        scrollTo(elems.docs.offsetTop-20, elems.scroll, 300, easing.easeInQuad);
    }

    function scrollToTest() {
        scrollTo(elems.test.offsetTop-20, elems.scroll, 300, easing.easeInQuad);
    }
}
