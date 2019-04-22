module.exports = api => {
	api.cache(true);

	const presets = [
    ["@babel/preset-env", {
      "targets": {
        "node": "8"
      }
    }]
  ];

  const plugins = [
  	"@babel/plugin-proposal-export-default-from",
  	"@babel/plugin-proposal-class-properties"
  ];

	return {
		presets,
		plugins
	};
};
