export class SlotMachineConfiguration {
  // Model
  readonly countColumns:number = 5
  readonly countRows:number = 3

  // Visuals
  readonly symbolTargetWidth:number = 90
  readonly symbolTargetHeight:number = 80

  readonly symbolDesignWidth:number = 90
  readonly symbolDesignHeight:number = 80
}

export const configuration = new SlotMachineConfiguration();