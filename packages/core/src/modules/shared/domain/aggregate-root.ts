export abstract class AggregateRoot {
  // Marker: implementors own their aggregate boundary.
  // Only the root is accessible from outside — internal entities
  // are reached exclusively through the root.
  // Repositories exist one-per-aggregate-root.
}
