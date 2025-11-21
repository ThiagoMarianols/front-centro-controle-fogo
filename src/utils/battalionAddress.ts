import type { BattalionDTO } from '../interfaces/IBattalion';

type AddressFields = Partial<BattalionDTO['address']> & {
  zipCode?: string | number;
  number?: string | number;
};

type AddressKey = keyof Required<BattalionDTO['address']>;

const ADDRESS_ALIASES: Record<AddressKey, string[]> = {
  zipCode: ['zipCode', 'cep'],
  street: ['street', 'logradouro'],
  number: ['number', 'numero'],
  neighborhood: ['neighborhood', 'bairro'],
  city: ['city', 'cidade', 'cityName'],
  state: ['state', 'estado', 'uf'],
  complement: ['complement', 'complemento'],
};

const hasAddressField = (candidate: Record<string, unknown>) => {
  const aliasGroups = Object.values(ADDRESS_ALIASES) as string[][];
  return aliasGroups.some((aliases) =>
    aliases.some((alias) => alias in candidate && candidate[alias] !== undefined && candidate[alias] !== null)
  );
};

const normalizeAddressFields = (candidate: Record<string, unknown>): AddressFields => {
  const normalized: AddressFields = {};

  (Object.keys(ADDRESS_ALIASES) as AddressKey[]).forEach((key) => {
    const aliases = ADDRESS_ALIASES[key] as string[];
    for (const alias of aliases) {
      if (alias in candidate && candidate[alias] !== undefined && candidate[alias] !== null) {
        (normalized as Record<string, unknown>)[key] = candidate[alias];
        break;
      }
    }
  });

  return normalized;
};

export const extractBattalionAddress = (
  candidate: unknown,
  visited = new WeakSet<object>()
): AddressFields | undefined => {
  if (!candidate || typeof candidate !== 'object') {
    return undefined;
  }

  const node = candidate as Record<string, unknown>;

  if (visited.has(node)) {
    return undefined;
  }
  visited.add(node);

  if (hasAddressField(node)) {
    return normalizeAddressFields(node);
  }

  for (const value of Object.values(node)) {
    const resolved = extractBattalionAddress(value, visited);
    if (resolved) {
      return resolved;
    }
  }

  return undefined;
};
