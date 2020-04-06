import { ThreadConnection } from '../ThreadConnection'
import { WorkerConnection } from '../WorkerConnection'
import { MessageChannel, MessagePort } from 'worker_threads'
import { EventEmitter } from 'events'

class FakeMessagePort extends EventEmitter implements Partial<MessagePort> {
	close(): void {
		this.emit('close')
		return
	}
	postMessage(value: any, transferList?: Array<ArrayBuffer | MessagePort>): void {
		this.emit('message', value)
	}

	ref(): void {
		return
	}
	unref(): void {
		return
	}
	start(): void {
		return
	}
}

describe('Connection', () => {
	test('it can send a mesage over a port', async () => {
		const port1 = new FakeMessagePort()
		let receivedMessage: string | null = null

		new ThreadConnection<string, string>(port1, async message => {
			receivedMessage = message
			return 'Hi'
		})

		const wc = new WorkerConnection(port1)
		const response = await wc.send('Hello World')
		expect(receivedMessage).toEqual('Hello World')
		expect(response).toEqual(['Hi'])
	})
})
