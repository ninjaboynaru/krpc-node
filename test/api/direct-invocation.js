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

            let control = await spaceCenter._vesselGetControl(vessel.id);
            expect(control).to.be.ok();

            let control2 = await vessel.control;
            expect(control2).to.be.ok();

			control.sas = true;
			let sasState = await control.sas;
			expect(sasState).to.be.equal(true);

        } catch (err) {
            await client.close();
            throw err;
        }
        await client.close();
    });
});
