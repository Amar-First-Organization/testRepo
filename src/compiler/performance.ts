/*@internal*/
namespace ts {
    declare const performance: { now?(): number } | undefined;
    /** Gets a timestamp with (at least) ms resolution */
    export const timestamp = typeof performance !== "undefined" && performance.now ? () => performance.now() : Date.now ? Date.now : () => +(new Date());
}

/*@internal*/
namespace ts.performance {
    /** Performance measurements for the compiler. */
    declare const onProfilerEvent: { (markName: string): void; profiler: boolean; };
    let profilerEvent: (markName: string) => void;
    let counters: StringMap<number>;
    let measures: StringMap<number>;

    /**
     * Emit a performance event if ts-profiler is connected. This is primarily used
     * to generate heap snapshots.
     *
     * @param eventName A name for the event.
     */
    export function emit(eventName: string) {
        if (profilerEvent) {
            profilerEvent(eventName);
        }
    }

    /**
     * Increments a counter with the specified name.
     *
     * @param counterName The name of the counter.
     */
    export function increment(counterName: string) {
        if (counters) {
            counters.set(counterName, (counters.get(counterName)) || 0 + 1);
        }
    }

    /**
     * Gets the value of the counter with the specified name.
     *
     * @param counterName The name of the counter.
     */
    export function getCount(counterName: string) {
        return counters && counters.get(counterName) || 0;
    }

    /**
     * Marks the start of a performance measurement.
     */
    export function mark() {
        return measures ? timestamp() : 0;
    }

    /**
     * Adds a performance measurement with the specified name.
     *
     * @param measureName The name of the performance measurement.
     * @param marker The timestamp of the starting mark.
     */
    export function measure(measureName: string, marker: number) {
        if (measures) {
            measures.set(measureName, (measures.get(measureName) || 0) + (timestamp() - marker));
        }
    }

    /**
     * Iterate over each measure, performing some action
     *
     * @param cb The action to perform for each measure
     */
    export function forEachMeasure(cb: (measureName: string, duration: number) => void) {
        measures.forEach((value, key) => cb(key, value));
    }

    /**
     * Gets the total duration of all measurements with the supplied name.
     *
     * @param measureName The name of the measure whose durations should be accumulated.
     */
    export function getDuration(measureName: string) {
        return measures && measures.get(measureName) || 0;
    }

    /** Enables (and resets) performance measurements for the compiler. */
    export function enable() {
        counters = new StringMap();
        measures = createStringMapFromKeys( ["I/O Read", "I/O Write", "Program", "Parse", "Bind", "Check", "Emit"], () => 0);

        profilerEvent = typeof onProfilerEvent === "function" && onProfilerEvent.profiler === true
            ? onProfilerEvent
            : undefined;
    }

    /** Disables (and clears) performance measurements for the compiler. */
    export function disable() {
        counters = undefined;
        measures = undefined;
        profilerEvent = undefined;
    }
}
