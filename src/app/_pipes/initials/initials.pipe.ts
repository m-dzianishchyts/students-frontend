import { Pipe, PipeTransform } from "@angular/core";
import { UserName } from "../../../_models/user";

@Pipe({
    name: "initials",
})
export class InitialsPipe implements PipeTransform {
    transform(name?: UserName): string {
        return name ? `${name.first.slice(0, 1)}. ${name.last}` : "";
    }
}
