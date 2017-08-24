
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount, render } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';


import rootReducer from '../../main/resources/static/js/reducers';

import Upload from '../../main/resources/static/js/components/Upload';
import SideNavBar from '../../main/resources/static/js/components/SideNavBar';
import InfoBlock from '../../main/resources/static/js/components/InfoBlock';
import FileTree from '../../main/resources/static/js/components/FileTree';

import { addFileToTree, removeFileFromTree, resetTree, setToken } from '../../main/resources/static/js/actions';


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
            let itemText = item.first().text();
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

describe('>>> SideNavBar --- Mount',()=>{
    let wrapper;
    let store;


    beforeEach( ()=>{
        // This context object contains the results of the render
        const context = {}
        store = createStore(rootReducer);
        wrapper = mount(
            <Provider store={store}>
                <StaticRouter context={context}>
                    <SideNavBar />
                </StaticRouter>
            </Provider>
        );
    })

    it('+++ Share Button should not be present when there is no session token', ()=>{
        expect(wrapper.find("#token_num").text()).toBe("");
        expect(wrapper.find("#token-share").exists()).toBe(false);
    })

    it('+++ Share Button should be present when there is a session token', ()=>{
        store.dispatch(setToken("TEST_TOKEN"));
        expect(wrapper.find("#token_num").text()).toBe("TEST_TOKEN");
        expect(wrapper.find("#token-share").exists()).toBe(true);
    })
})

/*
describe('>>> Upload --- Mount',()=>{
    let wrapper;
    let store;

    const filenames = ["File1", "File2", "File3", "File4"];

    beforeEach( ()=>{

        store = createStore(rootReducer, {filenames});
        wrapper = mount(
            <Provider store={store}>
                <Upload />
            </Provider>
        );
    })

    it('+++ render Upload', () => {
       expect(wrapper.length).toEqual(1)
    });

    it('+++ retrieving token', () => {
        const input = wrapper.find("#inputToken").first();
        const button = wrapper.find("button").first();

        fetch.mockResponseOnce("true");
        fetch.mockResponseOnce(JSON.stringify(["File1", "File2", "File3"]))

        input.simulate('change', { target: { value: 'TEST_TOKEN' } });
        button.simulate('click')
        wrapper.update()
        console.log(wrapper.find(<Upload />).state())
    })

})
*/


