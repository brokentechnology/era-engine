import React from 'react';
import {assert} from 'chai'
import {shallow} from 'enzyme'
import {LightPanelPresentation as LightPanel} from '../light-panel'
import {LightFormContainer as LightForm} from '../light-form'
import {LightRowContainer as LightRow} from '../light-row'

describe('<LightPanel />', () => {

    it('renders a <LightForm /> component with no <Light /> components', () => {
        const wrapper = shallow(<LightPanel data={{light:[], loading: false}} />);
        assert.equal(wrapper.find(LightForm).length, 1);
        assert.equal(wrapper.find(LightRow).length, 0);
    });

    it('renders three <Light /> components', () => {
        const lights = [
            {id: 1},
            {id: 2},
            {id: 3}
        ];
        const wrapper = shallow(<LightPanel data={{light:lights, loading: false}} />);
        assert.equal(wrapper.find(LightForm).length, 1);
        assert.equal(wrapper.find(LightRow).length, 3);
    });

});