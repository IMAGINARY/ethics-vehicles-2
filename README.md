# Ethics of Autonomous Vehicles 2

Updated version of [Ethics of Autonomous Vehicles](https://github.com/IMAGINARY/ethics-vehicles).

## Installation and Building

Run `yarn` to install all dependencies and download the required videos.

Run `yarn build` to build the project.

## Configuration

The video's download URL can be set by creating a `.env.local` file and setting the `VIDEO_URL` environment variable:

```bash
VIDEO_URL=http://exhibits.storage.imaginary.org/ethics-vehicles-2/videos/v0/
```

Configuration points are found in [public/config.yaml](./public/config.yaml). After building, you can override configuration by creating a file `settings.yaml` and putting it in the `dist` directory. For example, to adjust the position and color of one of the labels:

```yaml
scenarios:
  TreeFalls:
    labels:
      AutonomousCar:
        position: [750, 900]
        color: rgb(120, 180, 250)
```

## License

Code licensed under the MIT License. See [LICENSE.txt](/LICENSE.txt) for details.

Copyright 2025 Imaginary gGmbH.
