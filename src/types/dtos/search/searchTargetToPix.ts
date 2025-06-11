import type { Account } from "../../account";
import type { Pix } from "../../pix";
import type { User } from "../../user";

export interface SearchTargetPayment{
    user: User|undefined,
    account: Account|undefined,
    pixs: Pix[]|undefined
}