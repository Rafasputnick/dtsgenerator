import DtsGenerator from './dtsGenerator';
import { parseSchema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import SchemaConvertor from './schemaConvertor';
import WriteProcessor, { WriteProcessorOptions } from './writeProcessor';

export interface Options extends Partial<WriteProcessorOptions> {
    contents: any[];
    inputUrls: string[];
    header?: string;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const processor = new WriteProcessor(options);
    const resolver = new ReferenceResolver();
    const convertor = new SchemaConvertor(processor, options.header);

    options.contents
        .map((content) => parseSchema(content))
        .forEach(resolver.registerSchema);
    await Promise.all(options.inputUrls.map(resolver.registerRemoteSchema));

    const generator = new DtsGenerator(resolver, convertor);
    return await generator.generate();
}
