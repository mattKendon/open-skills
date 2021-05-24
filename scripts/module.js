import { libWrapper } from './libWrapperShim.js';

Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {
    patchActor5eRollSkill()
});

const MODULE_NAME = "open-skills";

function patchActor5eRollSkill() {
    console.log("Patching CONFIG.Actor.entityClass.prototype.rollSkill");
    libWrapper.register(MODULE_NAME, 'CONFIG.Actor.entityClass.prototype.rollSkill', function (wrapper, ...args) {
        const skl = this.data.data.skills[args[0]]

        let options = args[1]
        let parts = ['@prof']

        if (options.parts?.length > 0) {
            parts.push(...options.parts);
        }

        args[1] = mergeObject(mergeObject({
            data: {
                prof: skl.prof,
                abilities: this.data.data.abilities,
                ability: skl.ability
            },
            template: "modules/open-skills/templates/chat/roll-skill-dialog.html"
        }, options), {parts: parts})

        try {
            return wrapper(...args);
        } catch (e) {console.error(e);}

    }, 'WRAPPER');
}