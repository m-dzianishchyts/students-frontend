import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { INGXLoggerConfig } from "ngx-logger/lib/config/iconfig";
import { INGXLoggerConfigEngineFactory } from "ngx-logger/lib/config/iconfig-engine-factory";
import { INGXLoggerMetadataService } from "ngx-logger/lib/metadata/imetadata.service";
import { INGXLoggerRulesService } from "ngx-logger/lib/rules/irules.service";
import { INGXLoggerMapperService } from "ngx-logger/lib/mapper/imapper.service";
import { INGXLoggerWriterService } from "ngx-logger/lib/writer/iwriter.service";
import { INGXLoggerServerService } from "ngx-logger/lib/server/iserver.service";

@Injectable({
    providedIn: "root",
})
export class LogService extends NGXLogger {
    constructor(
        config: INGXLoggerConfig,
        configEngineFactory: INGXLoggerConfigEngineFactory,
        metadataService: INGXLoggerMetadataService,
        ruleService: INGXLoggerRulesService,
        mapperService: INGXLoggerMapperService,
        writerService: INGXLoggerWriterService,
        serverService: INGXLoggerServerService
    ) {
        super(config, configEngineFactory, metadataService, ruleService, mapperService, writerService, serverService);
    }

    override partialUpdateConfig(partialConfig: Partial<INGXLoggerConfig>) {
        super.partialUpdateConfig(partialConfig);
    }
}
