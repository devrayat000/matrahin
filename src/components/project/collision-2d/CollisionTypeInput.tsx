import { useAtom, useSetAtom } from "jotai";
import {
  COLLISION_TYPES,
  collisionTypeAtom,
  twoDCollisionInputsAtom,
} from "~/components/project/collision-2d/store";
import { deepCopy, getUpdatedV } from "~/components/project/collision-2d/utils";
import Chip from "~/components/ui/chip";

const CollisionTypeInput = () => {
  const [collisionType, setCollisionType] = useAtom(collisionTypeAtom);
  const setValues = useSetAtom(twoDCollisionInputsAtom);
  return (
    <div className="my-1">
      <div className="flex gap-2 items-center justify-between">
        <div className="font-bold md:text-xl">After collision:</div>
        <div className="flex gap-2">
          <Chip
            selected={collisionType === COLLISION_TYPES.ELASTIC}
            onClick={() => {
              setValues((values) => {
                const newValues = deepCopy(values);
                const { v1, v2 } = getUpdatedV(
                  newValues[0].M,
                  newValues[1].M,
                  newValues[0].V.i,
                  newValues[1].V.i,
                  COLLISION_TYPES.ELASTIC
                );
                newValues[0].V.f = v1;
                newValues[1].V.f = v2;
                return newValues;
              });
              setCollisionType(COLLISION_TYPES.ELASTIC);
            }}
          >
            Separate
          </Chip>
          <Chip
            selected={collisionType === COLLISION_TYPES.INELASTIC}
            onClick={() => {
              setValues((values) => {
                const newValues = deepCopy(values);
                const { v1, v2 } = getUpdatedV(
                  newValues[0].M,
                  newValues[1].M,
                  newValues[0].V.i,
                  newValues[1].V.i,
                  COLLISION_TYPES.INELASTIC
                );
                newValues[0].V.f = v1;
                newValues[1].V.f = v2;
                return newValues;
              });
              setCollisionType(COLLISION_TYPES.INELASTIC);
            }}
          >
            Stick Together
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default CollisionTypeInput;
