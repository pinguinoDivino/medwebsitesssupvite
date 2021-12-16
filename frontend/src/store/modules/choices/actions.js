import { axiosService } from "../../../common/api.service";

export default {
  async loadChoices(context, options) {
    for (const option of options) {
      try {
        const response = await axiosService(`/api/${option}/`);
        context.commit("setChoice", {
          [option]: response.data
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }
};
