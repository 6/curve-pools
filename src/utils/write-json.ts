import { PathLike } from 'fs';
import { FileHandle, writeFile } from 'fs/promises';
import prettier from 'prettier';

export const writeJSON = (file: PathLike | FileHandle, data: unknown): Promise<void> => {
  const prettyJSON = prettier.format(JSON.stringify(data), {
    parser: 'json',
  });
  return writeFile(file, prettyJSON);
};
