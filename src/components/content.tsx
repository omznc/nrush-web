'use client'

import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ["latin"] });

const ParticleText = () => {
	const textRef = useRef<THREE.Points>(null)
	const particlesCount = 5000 // Increased particle count for larger text

	const { positions, originalPositions } = useMemo(() => {
		const positions = new Float32Array(particlesCount * 3)
		const originalPositions = new Float32Array(particlesCount * 3)
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')!
		canvas.width = 1024
		canvas.height = 256
		ctx.fillStyle = '#ffffff'
		ctx.font = `bold 200px ${inter.style.fontFamily}`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText('nrush', canvas.width / 2, canvas.height / 2)

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const data = imageData.data

		let index = 0
		for (let i = 0; i < particlesCount; i++) {
			let x, y
			do {
				x = Math.random() * canvas.width
				y = Math.random() * canvas.height
			} while (!data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3])

			const posX = (x / canvas.width - 0.5) * 2
			const posY = -(y / canvas.height - 0.5) * 2 * (canvas.height / canvas.width)
			const posZ = 0

			positions[index] = posX
			positions[index + 1] = posY
			positions[index + 2] = posZ

			originalPositions[index] = posX
			originalPositions[index + 1] = posY
			originalPositions[index + 2] = posZ

			index += 3
		}

		return { positions, originalPositions }
	}, [])

	useFrame(() => {
		if (textRef.current) {
			const positions = textRef.current.geometry.attributes.position.array as Float32Array

			for (let i = 0; i < particlesCount; i++) {
				const i3 = i * 3
				positions[i3] = originalPositions[i3] + (Math.random() - 0.5) * 0.05
				positions[i3 + 1] = originalPositions[i3 + 1] + (Math.random() - 0.5) * 0.05
				positions[i3 + 2] = originalPositions[i3 + 2] + (Math.random() - 0.5) * 0.05
			}

			textRef.current.geometry.attributes.position.needsUpdate = true
		}
	})

	return (
		<points ref={textRef}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={particlesCount}
					array={positions}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial size={0.01} color="#ffffff" sizeAttenuation={true} />
		</points>
	)
}

export function Content() {
	const [activeTab, setActiveTab] = useState('usage')

	return (
		<div className="w-full min-h-screen bg-black text-white">
			<div
				className="h-[15dvh] md:h-[25dvh] w-screen mb-12 pt-4"
			>
				<Canvas camera={{ position: [0, 0, 1.2], fov: 20 }}>
					<ParticleText />
				</Canvas>
			</div>

			<main className="max-w-4xl mx-auto p-6">
				<p className="text-xl text-neutral-300 mb-6 text-center">A speedy way to update all packages in a
					Node/Bun project, written in Rust.</p>
				<div className="flex justify-center space-x-4 mb-8">
					<Link href="https://www.npmjs.com/package/nrush" className="flex items-center">
						<img src="https://img.shields.io/npm/dw/nrush?style=for-the-badge&logo=npm" alt="npm downloads"
							className="h-6" />
					</Link>
					<Link href="https://github.com/omznc/nrush" className="flex items-center">
						<img
							src="https://img.shields.io/github/actions/workflow/status/omznc/nrush/cd.yml?style=for-the-badge&logo=github"
							alt="GitHub status" className="h-6" />
					</Link>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
					<TabsList className="grid w-full grid-cols-4 bg-white/10 ">
						<TabsTrigger value="usage"
							className="text-white text-xs md:text-md data-[state=active]:bg-neutral-200">Usage</TabsTrigger>
						<TabsTrigger value="commands"
							className="text-white text-xs md:text-md data-[state=active]:bg-neutral-200">Commands</TabsTrigger>
						<TabsTrigger value="purpose"
							className="text-white text-xs md:text-md data-[state=active]:bg-neutral-200">Purpose</TabsTrigger>
						<TabsTrigger value="contribute"
							className="text-white text-xs md:text-md data-[state=active]:bg-neutral-200">Contribute</TabsTrigger>
					</TabsList>
					<TabsContent value="usage" className="mt-6 slide-down">
						<h2 className="text-2xl font-semibold mb-4">Usage</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-4">
							<div>
								<h3 className="text-xl font-semibold mb-2">Bun</h3>
								<pre id={'prebun'}
									className="relative bg-neutral-900 md:h-full p-4 rounded-lg overflow-x-auto cursor-pointer"
									onClick={
										() => {
											navigator.clipboard.writeText('bun --bun add -d nrush@latest\nnrush -i')
											const prebun = document.getElementById('prebun')
											const overlay = document.createElement('div')
											overlay.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black/50', 'flex', 'justify-center', 'items-center', 'text-white', 'text-sm', 'font-mono', 'z-10')
											overlay.innerText = 'copied to clipboard'
											prebun?.appendChild(overlay)

											setTimeout(() => {
												prebun?.removeChild(overlay)
											}, 500)
										}
									}>
									<code>
										bun --bun add -d nrush@latest{'\n'}
										nrush -i
									</code>
								</pre>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Node</h3>
								<pre id={'prenode'}
									className="relative bg-neutral-900 md:h-full p-4 rounded-lg overflow-x-auto cursor-pointer"
									onClick={
										() => {
											navigator.clipboard.writeText('npx nrush@latest -i')
											const prenode = document.getElementById('prenode')
											const overlay = document.createElement('div')
											overlay.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black/50', 'flex', 'justify-center', 'items-center', 'text-white', 'text-sm', 'font-mono', 'z-10')
											overlay.innerText = 'copied to clipboard'
											prenode?.appendChild(overlay)

											setTimeout(() => {
												prenode?.removeChild(overlay)
											}, 500)
										}
									}>
									<code>
										npx nrush@latest -i
									</code>
								</pre>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="commands" className="mt-6 slide-down">
						<h2 className="text-2xl font-semibold mb-4">Commands & Arguments</h2>
						<ScrollArea className="h-[400px] rounded-md border border-neutral-800 p-4">
							<h3 className="text-xl font-semibold mb-2">Commands:</h3>
							<ul className="list-disc pl-6 mb-4">
								<li><code>nrush about</code> - Display comprehensive information about nrush.</li>
								<li><code>nrush help</code> - Provide a usage guide for nrush.</li>
							</ul>
							<h3 className="text-xl font-semibold mb-2">Arguments:</h3>
							<ul className="list-disc pl-6">
								<li><strong>Update Options</strong> (<code>-u</code> / <code>--update</code>):
									Automatically updates all dependencies without user interaction.
								</li>
								<li><strong>Interactive Mode</strong> (<code>-i</code> / <code>--interactive</code>):
									User can select which packages to update.
								</li>
								<li><strong>Include</strong> (<code>--include &lt;dev,peer&gt;</code>): Include dev
									and/or peer dependencies in the update process.
								</li>
								<li><strong>Path
									Specification</strong> (<code>-p &lt;path&gt;</code> / <code>--path &lt;path&gt;</code>):
									Specify the path to a package.json file.
								</li>
								<li><strong>Skip Ranges in Versioning</strong> (<code>--skip-ranges</code>): Skips
									version ranges in package.json.
								</li>
								<li><strong>Update Any Version</strong> (<code>--update-any</code>): Updates * versions
									in package.json.
								</li>
								<li><strong>Semver
									Constraint</strong> (<code>-s &lt;semver&gt;</code> / <code>--semver &lt;semver&gt;</code>):
									Specify a maximum semver range to update to (coming soon).
								</li>
							</ul>
						</ScrollArea>
					</TabsContent>
					<TabsContent value="purpose" className="mt-6 slide-down">
						<h2 className="text-2xl font-semibold mb-4">Purpose</h2>
						<p className="mb-4">I made this as a personal alternative to npm-check-updates, mostly as a
							challenge to write a less feature-packed, faster version that checks the packages
							concurrently, resulting in 🔥speed🔥.</p>
						<p className="font-semibold">Concurrency, baby.</p>
						<h3 className="text-xl font-semibold mt-6 mb-2">Goals</h3>
						<ul className="list-disc pl-6">
							<li>Full feature set from npm-check-updates</li>
						</ul>
					</TabsContent>
					<TabsContent value="contribute" className="mt-6 slide-down">
						<h2 className="text-2xl font-semibold mb-4">Contributing</h2>
						<p className="mb-4">Please do. I don't really do Rust that often, and all of this was done in 30
							minutes.</p>
					</TabsContent>

				</Tabs>

				<div className="mt-14 pt-6 border border-neutral-800 p-4 rounded-lg">
					<h2 className="text-2xl font-semibold mb-4">Notes</h2>
					<ul className="list-disc pl-6">
						<li>nrush is short for npm rush, as in "please get me up to date"</li>
						<li>The base omznc/nrush package figures out your OS architecture and downloads the correct
							binary. It uses child_process which you could find alarming, but hey, that's what
							open-source is for.
						</li>
					</ul>
					<details className="mt-4">
						<summary className="cursor-pointer font-semibold">Underlying binaries</summary>
						<ul className="list-disc pl-6 mt-2">
							<li><a href="https://www.npmjs.com/package/nrush-windows-x64"
								className="text-blue-400 hover:underline">nrush-windows-x64</a></li>
							<li><a href="https://www.npmjs.com/package/nrush-windows-arm64"
								className="text-blue-400 hover:underline">nrush-windows-arm64</a></li>
							<li><a href="https://www.npmjs.com/package/nrush-darwin-x64"
								className="text-blue-400 hover:underline">nrush-darwin-x64</a></li>
							<li><a href="https://www.npmjs.com/package/nrush-darwin-arm64"
								className="text-blue-400 hover:underline">nrush-darwin-arm64</a></li>
							<li><a href="https://www.npmjs.com/package/nrush-linux-x64"
								className="text-blue-400 hover:underline">nrush-linux-x64</a></li>
							<li><a href="https://www.npmjs.com/package/nrush-linux-arm64"
								className="text-blue-400 hover:underline">nrush-linux-arm64</a></li>
						</ul>
					</details>
				</div>

				<Link href="https://omarzunic.com?utm_source=nrush"
					className="mt-12 flex opacity-30 hover:opacity-100 transition-all items-center justify-center">
					with ❤️ by
					omznc
				</Link>
			</main>
		</div>
	)
}