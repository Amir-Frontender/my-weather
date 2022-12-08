'use strict'; 


export default function tabs(tabs, headingItem, contentItem, activeClass) { //Функция скрывающая, показывающая разделы погоды
    const tabsElem = document.querySelector(tabs); 
    const headingItems = document.querySelectorAll(headingItem); 
    const contentItems = document.querySelectorAll(contentItem); 
    activeClass = activeClass.slice(1); 
    
    const removeActive = (items) => {
        items.forEach(elem => {
            elem.classList.remove(activeClass); 
        })
    }

    const addActive = (items, index = 0) => {
        items[index].classList.add(activeClass);
    }

    removeActive(headingItems);
    removeActive(contentItems);
    addActive(headingItems);
    addActive(contentItems);

    tabsElem.addEventListener('click', e => {
        const {target} = e; 

        headingItems.forEach((elem, index) => {
            if(target === elem) {
                removeActive(headingItems);
                removeActive(contentItems);

                addActive(headingItems, index);
                addActive(contentItems, index);
            }
        })
    })
}


