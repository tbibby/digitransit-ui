import * as utils from '../../../../utils/client/indoorUtils';
import { IndoorLegType } from '../../../../utils/shared/constants';

const entranceStep = {
  feature: { __typename: 'Entrance', publicCode: 'A' },
  lat: 1,
  lon: 1,
};

const stairsStep = {
  feature: { __typename: 'StairsUse', verticalDirection: 'UP' },
  lat: 1,
  lon: 1,
};

function walkLeg(steps) {
  return {
    mode: 'WALK',
    steps,
    from: {},
    to: {},
  };
}

describe('indoorUtils', () => {
  describe('getEntranceObject', () => {
    it('returns undefined when the leg has no steps', () => {
      expect(utils.getEntranceObject(undefined, { steps: undefined })).toBe(
        undefined,
      );
    });

    it('returns undefined when there is no Entrance step', () => {
      const leg = walkLeg([stairsStep]);
      expect(utils.getEntranceObject(undefined, leg)).toBe(undefined);
    });

    it('finds an Entrance step regardless of the adjacent leg mode', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'RAIL', transitLeg: true };
      const entrance = utils.getEntranceObject(previousLeg, leg);
      expect(entrance).toBeDefined();
      // eslint-disable-next-line no-underscore-dangle
      expect(entrance.feature.__typename).toBe('Entrance');
    });
  });

  describe('getIndoorLegType', () => {
    it('returns NoStepsInside when there is no entrance step', () => {
      const leg = walkLeg([stairsStep]);
      expect(utils.getIndoorLegType(undefined, leg, undefined)).toBe(
        IndoorLegType.NoStepsInside,
      );
    });

    it('returns NoStepsInside when neither adjacent leg is transit', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'WALK', transitLeg: false };
      const nextLeg = { mode: 'WALK', transitLeg: false };
      expect(utils.getIndoorLegType(previousLeg, leg, nextLeg)).toBe(
        IndoorLegType.NoStepsInside,
      );
    });

    it('returns StepsBeforeEntranceInside for a SUBWAY-adjacent leg (HSL use case, unchanged)', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'SUBWAY', transitLeg: true };
      expect(utils.getIndoorLegType(previousLeg, leg, undefined)).toBe(
        IndoorLegType.StepsBeforeEntranceInside,
      );
    });

    it('returns StepsAfterEntranceInside for a SUBWAY-adjacent leg (HSL use case, unchanged)', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const nextLeg = { mode: 'SUBWAY', transitLeg: true };
      expect(utils.getIndoorLegType(undefined, leg, nextLeg)).toBe(
        IndoorLegType.StepsAfterEntranceInside,
      );
    });

    it('returns StepsBeforeEntranceInside for a RAIL-adjacent leg (Ireland use case)', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'RAIL', transitLeg: true };
      expect(utils.getIndoorLegType(previousLeg, leg, undefined)).toBe(
        IndoorLegType.StepsBeforeEntranceInside,
      );
    });

    it('returns StepsAfterEntranceInside for a RAIL-adjacent leg (Ireland use case)', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const nextLeg = { mode: 'RAIL', transitLeg: true };
      expect(utils.getIndoorLegType(undefined, leg, nextLeg)).toBe(
        IndoorLegType.StepsAfterEntranceInside,
      );
    });

    it('returns StepsBeforeEntranceInside for a BUS-adjacent leg', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'BUS', transitLeg: true };
      expect(utils.getIndoorLegType(previousLeg, leg, undefined)).toBe(
        IndoorLegType.StepsBeforeEntranceInside,
      );
    });

    it('treats a leg that itself starts at a stop with a vehicleMode as inside, regardless of mode', () => {
      const leg = {
        mode: 'RAIL',
        steps: [entranceStep, stairsStep],
        from: { stop: { vehicleMode: 'RAIL' } },
        to: {},
      };
      expect(utils.getIndoorLegType(undefined, leg, undefined)).toBe(
        IndoorLegType.StepsBeforeEntranceInside,
      );
    });
  });

  describe('getIndoorStepsWithVerticalTransportation', () => {
    it('returns [] when the adjacent leg is not transit', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const previousLeg = { mode: 'WALK', transitLeg: false };
      expect(
        utils.getIndoorStepsWithVerticalTransportation(
          previousLeg,
          leg,
          undefined,
        ),
      ).toEqual([]);
    });

    it('returns vertical-transportation steps for a RAIL-adjacent leg', () => {
      const leg = walkLeg([entranceStep, stairsStep]);
      const nextLeg = { mode: 'RAIL', transitLeg: true };
      const steps = utils.getIndoorStepsWithVerticalTransportation(
        undefined,
        leg,
        nextLeg,
      );
      expect(steps).toHaveLength(1);
      // eslint-disable-next-line no-underscore-dangle
      expect(steps[0].feature.__typename).toBe('StairsUse');
    });
  });
});
