'use strict';
require('../init');
let { createClient } = require('../../lib/client');

describe('Getting Started - async', function() {
    it('Should work', async function() {
        this.timeout(10000);
        const client = await createClient();
        const { spaceCenter } = client.services;
        try {
            let response = await client.send(spaceCenter.getActiveVessel());
            let vessel = response.results[0].value;
            response = await spaceCenter._vesselGetControl(vessel.id);
            let control = response.results[0].value;
            expect(control).to.be.ok();
            let control2 = await vessel.control;
            expect(control2).to.be.ok();
			control.sas = true;
			response = await control.sas;
			let sasState = response.results[0].value;
			expect(sasState).to.be.equal(true);
        } catch (err) {
            await client.close();
            throw err;
        }
        await client.close();
    });
});
