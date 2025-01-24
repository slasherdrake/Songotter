import { type ClientSchema, a, defineData, defineFunction, secret} from "@aws-amplify/backend";

const loginHandler = defineFunction({
  name: 'login-handler',
  entry: './login-handler/handler.ts',
  environment: {
    SPOTIFY_CLIENT_ID: secret('SPOTIFY_CLIENT_ID'),
    SPOTIFY_CLIENT_SECRET: secret('SPOTIFY_CLIENT_SECRET'),
    SPOTIFY_REDIRECT_URI: secret('SPOTIFY_REDIRECT_URI'),
  }
})
const refreshHandler = defineFunction({
  name: 'refresh-handler',
  entry: './refresh-handler/refresh-handler.ts',
  environment: {
    SPOTIFY_CLIENT_ID: secret('SPOTIFY_CLIENT_ID'),
    SPOTIFY_CLIENT_SECRET: secret('SPOTIFY_CLIENT_SECRET'),
  }
})
const SpotifyUrlHandler = defineFunction({
  name: 'spotify-url-handler',
  entry: './spotify-url-handler/spotify-url-handler.ts',
  environment: {
    SPOTIFY_CLIENT_ID: secret('SPOTIFY_CLIENT_ID'),
    SPOTIFY_REDIRECT_URI: secret('SPOTIFY_REDIRECT_URI'),
  }
})



const schema = a.schema({
  
  UserToken: a.model({
    id: a.id(),
    accessToken: a.string().required(),
    refreshToken: a.string().required(),
    expiresAt: a.string().required(),
    
  }).authorization(
    allow => [
      allow.owner(),
    ]),

  loginToSpotify: a
    .query()
    .arguments({
      code: a.string().required(),
    })
    .returns(a.ref('spotifyResponse'))
    .handler(a.handler.function(loginHandler))
    .authorization(allow => [allow.authenticated()]),
    
    spotifyResponse: a.customType({
      access_token: a.string(),
      refresh_token: a.string(),
      expires_in: a.integer(),
    }),

    refreshToken: a
    .query()
    .arguments({

      refresh_token: a.string().required(),
    })
    .returns(a.ref('spotifyResponse'))
    .handler(a.handler.function(refreshHandler))
    .authorization(allow => [allow.authenticated()]),

    getSpotifyAuthUrl: a
    .query()
    .returns(a.string())
    .handler(a.handler.function(SpotifyUrlHandler))
    .authorization(allow => [allow.authenticated()]),
    AuthUrlResponse: a.customType({
      url: a.string(),
    }),

    Post: a.model({
      id: a.id().required(),
      userId: a.string().required(),
      spotifyId: a.string(),
      displayName: a.string(),
      title: a.string(),
      artist: a.string(),

      comment: a.string(),
      rating: a.string(),
      type: a.string(),
      link: a.string(),
      image: a.string(),
      createdAt: a.string().required(),
      order: a.string().required(),
      private: a.boolean(),
      likes: a.integer(),
      stringPost: a.string(),

    }).identifier(['id'])
    
    .secondaryIndexes(index => [
      
      index('userId')
      .sortKeys(["order"]),
      index('stringPost').sortKeys(['order']),
      
    ])
      .authorization(allow => [
        allow.owner().to(['create', 'read', 'update', 'delete']),
        allow.authenticated().to(['read']),
      ]),

    Comment: a.model({
      id: a.id().required(),
      userId: a.string().required(),
      postId: a.string().required(),
      content: a.string(),
      createdAt: a.string(),
      private: a.boolean(),
      likes: a.integer(),

    }).identifier(['id'])// Keep primary key as 'id'
    .secondaryIndexes((index) =>[
      index('createdAt')
    ])
      .authorization(allow => [
        allow.owner().to(['create', 'read', 'update', 'delete']),
        allow.authenticated().to(['read'])
      ]),

    Like: a.model({
      id: a.id().required(),
      userId: a.string().required(),
      postId: a.string().required(),
      commentId: a.string(),
    
      
    }).identifier(['id'])// Keep primary key as 'id'
    .secondaryIndexes((index) =>[
      index('postId')
    ])
      .authorization(allow => [
        allow.owner().to(['create', 'read', 'update', 'delete']),
        allow.authenticated().to(['read'])
      ]),
    postLikeIncrement: a.mutation()
    .arguments({ postId: a.id()})
    .returns(a.ref('Post'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      dataSource: a.ref('Post'),
      entry: './increment-like.js'
    })),
    postLikeDecrement: a.mutation()
    .arguments({ postId: a.id()})
    .returns(a.ref('Post'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.custom({
      dataSource: a.ref('Post'),
      entry: './decrement-like.js'
    }))

});

export type Schema = ClientSchema<typeof schema>;


export const data = defineData({
  schema,
  authorizationModes: {

    defaultAuthorizationMode: 'userPool',
    
  },
});


