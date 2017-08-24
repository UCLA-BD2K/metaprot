
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount, render } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, Link, Switch, IndexRoute} from 'react-router-dom';
import { createBrowserHistory } from 'history';


import rootReducer from '../../main/resources/static/js/reducers';

import Home from '../../main/resources/static/js/components/Home';
import InfoBlock from '../../main/resources/static/js/components/InfoBlock';
import FileTree from '../../main/resources/static/js/components/FileTree';

import { addFileToTree, removeFileFromTree, resetTree } from '../../main/resources/static/js/actions';


describe('>>> InfoBlock --- Shallow Render',()=>{
    let wrapper;
    const preHTML = (<div><p>this is pre-html</p></div>);
    const postHTML = (<div><p>this is post-html</p></div>);

    beforeEach(()=>{
        wrapper = shallow(
            <InfoBlock data={{
                title:"TEST_TITLE",
                description:"TEST_DESCRIPTION",
                preHTML:preHTML,
                postHTML:postHTML
            }}/>
        )
    })

    it('+++ render InfoBlock', () => {
       expect(wrapper.length).toEqual(1)
    });

    it('+++ InfoBlock contains information', () => {
        expect(wrapper.find("h4").text()).toEqual("TEST_TITLE");
        expect(wrapper.find(".infoblock-description").text()).toEqual("TEST_DESCRIPTION");
        expect(wrapper.contains(preHTML)).toBe(true);
        expect(wrapper.contains(postHTML)).toBe(true);
    })

});


describe('>>> FileTree --- Mount',()=>{
    let wrapper;
    let store;

    const filenames = ["File1", "File2", "File3", "File4"];

    beforeEach(()=>{
        store = createStore(rootReducer, {filenames});
        wrapper = mount(
            <Provider store={store}>
                <FileTree />
            </Provider>
        );
    })

    it('+++ render FileTree', () => {
       expect(wrapper.length).toEqual(1)
    });

    it('+++ 4 items rendered in FileTree', () => {
        expect(wrapper.find("#file-tree").children().length).toBe(4)
        let tempFiles = filenames.slice();

        wrapper.find("#file-tree").children().forEach( (item, i) => {
            let itemText = item.childAt(0).text();
            expect(itemText).toBe(filenames[i]);
        })
    })

    it('+++ check action dispatching', () => {
        let actions, numItems, itemText;

        store.dispatch(addFileToTree("File5"));

        numItems = wrapper.find("#file-tree").children().length;
        expect(numItems).toBe(5);
        itemText = wrapper.find("#file-tree").childAt(4).text();
        expect(itemText).toBe("File5");

        store.dispatch(removeFileFromTree(filenames[0]));

        itemText = wrapper.find("#file-tree").childAt(0).text();
        expect(itemText).toBe(filenames[1]);

        store.dispatch(resetTree());

        numItems = wrapper.find("#file-tree").children().length;
        expect(numItems).toBe(0);
    });

});

describe('>>> Home --- Mount',()=>{
    let wrapper;
    let store;

    let history;
    const filenames = ["File1", "File2", "File3", "File4"];

    beforeEach( ()=>{

        history = createBrowserHistory();
        store = createStore(rootReducer, {filenames});
        wrapper = mount(
            <Provider store={store}>
            <Router history={history}>
                <Home />
                </Router>
            </Provider>
        );
    })

    it('+++ render Home', () => {
       expect(wrapper.length).toEqual(1)
       setTimeout( ()=>{
        console.log(wrapper);
       }, 10000)
    });

})


